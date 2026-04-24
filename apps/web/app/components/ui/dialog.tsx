"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { type ReactNode } from "react";

export function Dialog({ children, ...props }: RadixDialog.DialogProps) {
  return <RadixDialog.Root {...props}>{children}</RadixDialog.Root>;
}

export const DialogTrigger = RadixDialog.Trigger;

export function DialogContent({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <RadixDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6",
          "bg-[#131316] rounded-2xl border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
      >
        {title ? (
          <RadixDialog.Title className="text-lg font-semibold text-white mb-4">
            {title}
          </RadixDialog.Title>
        ) : (
          <VisuallyHidden.Root>
            <RadixDialog.Title>Dialog</RadixDialog.Title>
          </VisuallyHidden.Root>
        )}
        {children}
        <RadixDialog.Close className="absolute right-4 top-4 w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-150">
          <X size={14} />
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export const DialogClose = RadixDialog.Close;
