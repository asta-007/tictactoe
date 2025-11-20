import { Metadata } from "next";
import App from "./app";
import { APP_NAME, APP_DESCRIPTION, APP_OG_IMAGE_URL } from "~/lib/constants";
import { getMiniAppEmbedMetadata } from "~/lib/utils";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: APP_NAME,
    openGraph: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [APP_OG_IMAGE_URL],
    },
    other: {
      "fc:frame": JSON.stringify(getMiniAppEmbedMetadata()),
    },
  };
}
export const metadata = {
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://tictactoe-three-peach.vercel.app/frame.png",
  }
};


export default function Home() {
  return (<App />);
}
