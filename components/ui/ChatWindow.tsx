import { Message, MessageFile } from "@/lib/types";
import MessageList from "./MessageList";
import { useState, useRef } from "react";
import { sendMessageAPI, deleteMessageAPI } from "@/lib/api/messages";
import EmojiPicker from "emoji-picker-react";
import { FaceIcon, UploadIcon } from "@radix-ui/react-icons";

interface ChatWindowProps {
  userId: number | null;
  chatId: number | null;
  messages: Message[];
  files: MessageFile[];
  setNewMessage: (message: Message, files: MessageFile[]) => void;
  handleDeleteMessage: (id: number | null) => void;
}

export default function ChatWindow({
  userId,
  chatId,
  messages,
  files,
  setNewMessage,
  handleDeleteMessage,
}: ChatWindowProps) {
  const [content, setContent] = useState("");
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  function arrayToFileList(filesArray: File[]) {
    const dataTransfer = new DataTransfer();
    filesArray.forEach((file) => {
      dataTransfer.items.add(file);
    });

    return dataTransfer.files;
  }

  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(newFiles);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((f, i) => i !== index));
    if (fileInput.current)
      fileInput.current.files = arrayToFileList(selectedFiles);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const onSendMessage = async () => {
    if (chatId !== null) {
      const newMessage = await sendMessageAPI({ chatId, content });
      if (newMessage != null) {
        // const formData = new FormData();
        // selectedFiles.forEach((file) => {
        //   formData.append("file[]", file);
        // });
        // const newFiles = await sendMessageFilesAPI({ chatId, formData }); - Условный метод на отправку масива файлов, который возвращает массив типа MessageFile
        const newFiles: MessageFile[] = []; //По скольку никуда не отправляется, ничего не возвращается, преобразовываю сама
        selectedFiles.forEach((file) => {
          newFiles.push({
            chat_id: chatId,
            message_id: newMessage.id,
            path: "", //Файл нигде не хранится
            name: file.name,
            size: file.size,
            type: file.type,
          } as MessageFile);
        });
        if (newFiles) {
          setNewMessage(newMessage, newFiles);
          setContent("");
          if (fileInput.current) {
            setSelectedFiles([]);
            fileInput.current.files = arrayToFileList([]);
          }
        }
      }
    }
  };

  const deleteMessage = async (id: number) => {
    if (chatId !== null) {
      const deletedMessage = await deleteMessageAPI({ chatId, id });
      if (deletedMessage != null && handleDeleteMessage)
        handleDeleteMessage(id);
    }
  };

  return (
    <div
      className={`sm:flex ${chatId ? "flex" : "hidden"} flex-1 flex-col h-full max-h-screen relative`}
    >
      {!chatId ? (
        <div className="flex items-center justify-center w-full h-full">
          <h2 className="text-lg font-semibold">
            Select a chat to start messaging
          </h2>
        </div>
      ) : (
        <>
          {messages.length > 0 ? (
            <div className="flex-1 overflow-y-auto p-[10px]">
              <MessageList
                messages={messages}
                files={files}
                userId={userId}
                deleteMessage={deleteMessage}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <h2 className="text-lg font-semibold">No messages yet</h2>
            </div>
          )}
          <div className="sticky bottom flex items-end space-x-2 p-4">
            <div className="flex flex-col w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A73E8]">
              {selectedFiles.length > 0 && (
                <div className="flex gap-1 px-4 py-2 flex-wrap">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-[13px] flex items-center shadow-sm gap-2"
                    >
                      {file.name}
                      <span
                        onClick={() => removeFile(index)}
                        className="cursor-pointer font-bold hover:text-blue-200 transition-colors"
                      >
                        ×
                      </span>
                    </div>
                  ))}{" "}
                </div>
              )}
              <div className="flex px-2 py-2 gap-3">
                <div>
                  <FaceIcon
                    onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)} //Убрала ту функцию
                    className="w-[35px] h-[35px] text-gray-500 hover:text-gray-700"
                  ></FaceIcon>
                </div>
                <input
                  value={content}
                  onChange={onChange}
                  placeholder="type message"
                  type="text"
                  className="w-full rounded-lg text-gray-900 transition-all focus:outline-none"
                ></input>
                <div>
                  <label htmlFor="file_input">
                    <UploadIcon className="w-[35px] h-[35px] text-gray-500 hover:text-gray-700" />
                    <input
                      ref={fileInput}
                      id="file_input"
                      onChange={selectFile}
                      multiple={true}
                      type="file"
                      className="hidden"
                    ></input>
                  </label>
                </div>
              </div>
            </div>
            <div style={{ position: "fixed", bottom: 70 }}>
              <EmojiPicker
                open={isEmojiPickerOpen}
                onEmojiClick={(emojiObject) =>
                  setContent(content + emojiObject.emoji)
                }
                skinTonesDisabled={true}
              />
            </div>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={onSendMessage}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
