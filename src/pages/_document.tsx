import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>NovaRetro</title>
        <meta name="description" content="Chibundu's birthday" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
