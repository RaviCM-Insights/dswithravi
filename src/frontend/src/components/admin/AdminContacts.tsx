import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Mail, MailOpen, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useContacts,
  useDeleteContact,
  useMarkContactRead,
} from "../../hooks/use-backend";
import type { ContactSubmission } from "../../types";

const skeletonKeys = ["a", "b", "c", "d"] as const;

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ContactRow({
  contact,
  index,
}: { contact: ContactSubmission; index: number }) {
  const markReadMutation = useMarkContactRead();
  const deleteMutation = useDeleteContact();
  const [expanded, setExpanded] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`rounded-xl border transition-smooth ${
          contact.read ? "border-border/40" : "border-primary/30"
        }`}
        style={{
          background: contact.read
            ? "oklch(var(--card) / 0.3)"
            : "oklch(var(--primary) / 0.04)",
        }}
        data-ocid={`contact-row-${String(contact.id)}`}
      >
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex-shrink-0">
            {contact.read ? (
              <MailOpen size={16} className="text-muted-foreground" />
            ) : (
              <Mail size={16} className="text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground truncate">
                {contact.name}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {contact.email}
              </span>
              {!contact.read && (
                <Badge
                  className="text-xs px-1.5 py-0"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "oklch(var(--primary-foreground))",
                  }}
                >
                  New
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {contact.subject}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {formatDate(contact.createdAt)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label="Toggle message"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
            {!contact.read && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary"
                aria-label="Mark as read"
                data-ocid={`mark-read-${String(contact.id)}`}
                onClick={() =>
                  markReadMutation.mutate(contact.id, {
                    onError: () => toast.error("Failed to mark as read"),
                  })
                }
                disabled={markReadMutation.isPending}
              >
                <MailOpen size={14} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              aria-label="Delete message"
              data-ocid={`delete-contact-${String(contact.id)}`}
              onClick={() => setDeleteConfirm(true)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="px-5 pb-4 border-t border-border/30 pt-3"
          >
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {contact.message}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <a
                href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}`}
                className="text-xs text-primary underline underline-offset-2"
                data-ocid={`reply-contact-${String(contact.id)}`}
              >
                Reply via email
              </a>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(contact.createdAt)}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      <AlertDialog
        open={deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(false)}
      >
        <AlertDialogContent className="glass border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the message from {contact.name}. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              data-ocid="confirm-delete-contact"
              onClick={() => {
                deleteMutation.mutate(contact.id, {
                  onSuccess: () => toast.success("Message deleted"),
                  onError: () => toast.error("Failed to delete message"),
                });
                setDeleteConfirm(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function AdminContacts() {
  const { data: contacts, isLoading } = useContacts();

  const unread = contacts?.filter((c) => !c.read).length ?? 0;
  const sorted = [...(contacts ?? [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Contact Messages
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {unread > 0 ? (
              <span>
                <span className="text-primary font-medium">
                  {unread} unread
                </span>
                {contacts &&
                  contacts.length > unread &&
                  ` · ${contacts.length - unread} read`}
              </span>
            ) : (
              `${contacts?.length ?? 0} messages`
            )}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {skeletonKeys.map((k) => (
            <Skeleton key={k} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : !sorted.length ? (
        <div
          className="glass rounded-xl py-16 text-center"
          data-ocid="contacts-empty-state"
        >
          <Mail size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No messages yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Contact form submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((contact, i) => (
            <ContactRow key={String(contact.id)} contact={contact} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
