"use client";

import { useMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";
import Callout from "./callout";

// TODO: tableの表示ができるように
const components = {
  Image,
  Callout,
};
export default function Mdx({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return (
    <div className="prose lg:prose-lg max-w-full">
      <Component components={components} />
    </div>
  );
}
