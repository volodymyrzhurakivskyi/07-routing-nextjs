import './globals.css'; // або видаліть цей імпорт, якщо стилі вже є глобально

export default function NotesFilterLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}