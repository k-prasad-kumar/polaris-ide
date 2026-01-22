import { ChevronRightIcon } from "lucide-react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import {
  useCreateFile,
  useRenameFile,
  useDeleteFile,
  useCreateFolder,
  useFolderContents,
} from "@/hooks/use-files";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import TreeItemWrapper from "./tree-item-wrapper";
import { cn } from "@/lib/utils";
import LoadingRow from "./loading-row";
import { getItemPadding } from "./constants";
import CreateInput from "./create-input";
import RenameInput from "./rename-input";

const Tree = ({
  item,
  level = 0,
  projectId,
}: {
  item: Doc<"files">;
  level?: number;
  projectId: Id<"projects">;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);

  const createFile = useCreateFile();
  const renameFile = useRenameFile();
  const deleteFile = useDeleteFile();
  const createFolder = useCreateFolder();

  const startCreating = (type: "file" | "folder") => {
    setIsOpen(true);
    setCreating(type);
  };

  const handleCreate = (name: string) => {
    setCreating(null);

    if (creating == "file") {
      createFile({ projectId, name, content: "", parentId: item._id });
    } else {
      createFolder({ projectId, name, parentId: item._id });
    }
  };

  const handleRename = (newName: string) => {
    setIsRenaming(false);

    if (item.name === newName) return;

    renameFile({ id: item._id, newName });
  };

  const folderContents = useFolderContents({
    projectId,
    parentId: item._id,
    enabled: item.type === "folder" && isOpen,
  });

  if (item.type === "file") {
    const fileName = item.name;
    if (isRenaming)
      return (
        <RenameInput
          type="file"
          defaultValue={fileName}
          isOpen
          level={level}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
        />
      );
    return (
      <TreeItemWrapper
        item={item}
        level={level}
        isActive={false}
        onClick={() => {}}
        onDoubleClick={() => {}}
        onRename={() => setIsRenaming(true)}
        onDelete={() => {
          // Todo: close tab
          deleteFile({ id: item._id });
        }}
        // onCreateFile={() => {}}
        // onCreateFolder={() => {}}
      >
        <FileIcon fileName={fileName} className="size-4" autoAssign />
        <span className="truncate text-sm">{fileName}</span>
      </TreeItemWrapper>
    );
  }

  const folderName = item.name;
  const folderRender = (
    <>
      <div className="flex items-center gap-0.5">
        <ChevronRightIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground",
            isOpen && "rotate-90"
          )}
        />
        <FolderIcon folderName={folderName} className="size-4" />
      </div>
      <span className="truncate text-sm">{folderName}</span>
    </>
  );

  if (creating)
    return (
      <>
        <button
          onClick={() => setIsOpen((value) => !value)}
          className="w-full h-5.5 flex items-center gap-1 group hover:bg-accent/30 cursor-pointer"
          style={{ paddingLeft: getItemPadding(level, false) }}
        >
          {folderRender}
        </button>
        {isOpen && (
          <>
            {folderContents === undefined && <LoadingRow level={level + 1} />}
            <CreateInput
              type={creating}
              level={level + 1}
              onSubmit={handleCreate}
              onCancel={() => setCreating(null)}
            />
            {folderContents?.map((subItem) => (
              <Tree
                key={subItem._id}
                item={subItem}
                level={level + 1}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </>
    );

  if (isRenaming)
    return (
      <>
        <RenameInput
          type="folder"
          defaultValue={folderName}
          isOpen
          level={level}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
        />
        {isOpen && (
          <>
            {folderContents === undefined && <LoadingRow level={level + 1} />}
            {folderContents?.map((subItem) => (
              <Tree
                key={subItem._id}
                item={subItem}
                level={level + 1}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </>
    );

  return (
    <>
      <TreeItemWrapper
        item={item}
        level={level}
        isActive={false}
        onClick={() => setIsOpen((value) => !value)}
        // onDoubleClick={() => {}}
        onRename={() => setIsRenaming(true)}
        onDelete={() => {
          // Todo: close tab
          deleteFile({ id: item._id });
        }}
        onCreateFile={() => startCreating("file")}
        onCreateFolder={() => startCreating("folder")}
      >
        {folderRender}
      </TreeItemWrapper>
      {isOpen && (
        <>
          {folderContents === undefined && <LoadingRow level={level + 1} />}
          {folderContents?.map((subItem) => (
            <Tree
              key={subItem._id}
              item={subItem}
              level={level + 1}
              projectId={projectId}
            />
          ))}
        </>
      )}
    </>
  );
};
export default Tree;
