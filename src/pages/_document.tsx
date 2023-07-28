import { Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <body
        className="flex min-h-screen"
        style={{
          backgroundImage: "url('/star.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
