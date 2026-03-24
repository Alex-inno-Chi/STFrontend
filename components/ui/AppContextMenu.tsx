import * as ContextMenu from "@radix-ui/react-context-menu";

export type ContextMenuItemConfig = {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
};

type Props = {
  children: React.ReactNode;
  items: ContextMenuItemConfig[];
};

export function AppContextMenu({ children, items }: Props) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          className="z-[100] min-w-[180px] rounded-md border border-gray-200 bg-white p-1 shadow-lg"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {items.map((item) => (
            <ContextMenu.Item
              key={item.label}
              className={`cursor-pointer rounded px-3 py-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 ${
                item.destructive
                  ? "text-red-600 data-[highlighted]:bg-red-50"
                  : "text-gray-900"
              }`}
              onSelect={(e) => {
                e.preventDefault();
                item.onSelect();
              }}
            >
              {item.label}
            </ContextMenu.Item>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
