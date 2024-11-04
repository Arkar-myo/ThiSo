import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PolicySection {
  title: string;
  content: string;
}

interface PolicyDialogProps {
  title: string;
  sections: PolicySection[];
  triggerText: string;
}

const PolicyDialog: React.FC<PolicyDialogProps> = ({ title, sections, triggerText }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-xs hover:underline underline-offset-4 text-gray-500">
          {triggerText}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="p-6 space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{section.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default PolicyDialog
