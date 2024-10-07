// app/layout.tsx
import "antd/dist/reset.css"; // Ant Design's base styles

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
