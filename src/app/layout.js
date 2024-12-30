// app/layout.js
import { SessionProvider } from "next-auth/react";
import "./globals.css";
export default function Layout({ children }) {
    return (
        
      <html lang="en">
        <head>
          <title>To-Do App</title>
        </head>
        <body className="bg-customBg">
          <main>{children}</main>
        </body>
      </html>
    );
  }
  