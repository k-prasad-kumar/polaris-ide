import { Id } from "@/convex/_generated/dataModel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEditor } from "@/hooks/use-editor";
import { useFilePath } from "@/hooks/use-files";
import React from "react";
import { FileIcon } from "@react-symbols/icons/utils";

const FileBreadCrumbs = ({ projectId }: { projectId: Id<"projects"> }) => {
  const { activeTabId } = useEditor(projectId);
  const filePath = useFilePath(activeTabId);

  // Loading scenario
  if (filePath === undefined || !activeTabId) {
    return (
      <div className="p-2 pl-4 border-b bg-background">
        <Breadcrumb>
          <BreadcrumbList className="sm:gap-0.5 gap-0.5">
            <BreadcrumbItem className="text-sm">
              <BreadcrumbPage> &nbsp; </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  }
  return (
    <div className="p-2 pl-4 border-b bg-background">
      <Breadcrumb>
        <BreadcrumbList className="sm:gap-0.5 gap-0.5">
          {filePath.map((item, index) => {
            const isLast = index === filePath.length - 1;
            return (
              <React.Fragment key={item._id}>
                <BreadcrumbItem className="text-sm">
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-1">
                      <FileIcon
                        fileName={item.name}
                        autoAssign
                        className="size-4"
                      />
                      <span className="leading-none">{item.name}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={`#`} className="leading-none">
                      {item.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
export default FileBreadCrumbs;
