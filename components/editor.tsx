"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Icon } from "./icon";
import { Post } from "@prisma/client";
import { useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postPatchSchema, postPatchSchemaType } from "@/lib/validations/post";
import { z } from "zod";
import EditorJS from "@editorjs/editorjs";
import { useToast } from "../hooks/use-toast";
import { useRouter } from "next/navigation";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Code from "@editorjs/code";

interface EditorProps {
  post: Pick<Post, "id" | "title" | "content" | "published">;
}

type FormData = z.infer<typeof postPatchSchema>;

export default function Editor({ post }: EditorProps) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const ref = useRef<EditorJS>();

  const router = useRouter();
  const { toast } = useToast();

  const body = postPatchSchema.parse(post);

  const initializeEditor = useCallback(async () => {
    const editor = new EditorJS({
      holder: "editor",
      onReady() {
        ref.current = editor;
      },
      placeholder: "ここに記事を書く",
      inlineToolbar: true,
      data: body.content,
      tools: {
        header: Header,
        linkTool: LinkTool,
        list: List,
        code: Code,
      },
    });
  }, [post]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      initializeEditor();
    }
    return () => {
      ref.current?.destroy();
      ref.current = undefined;
    };
  }, [isMounted, initializeEditor]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
  });

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    const blocks = await ref.current?.save();

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: blocks,
      }),
    });

    setIsSaving(false);

    if (!response.ok) {
      return toast({
        title: "問題が発生しました。",
        description:
          "あなたの記事は保存されませんでした。もう一度お試しください。",
        variant: "destructive",
      });
    }

    router.refresh();

    return toast({
      description: "正常に保存されました🚀",
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="space-x-10 flex items-center">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <>
                <Icon.chevronLeft className="mr-2 h-4 w-4" />
                戻る
              </>
            </Link>
            <p className="text-sm text-muted-foreground">
              {post.published ? "公開" : "ドラフト"}
            </p>
          </div>
          <button type="submit" className={cn(buttonVariants())}>
            {isSaving && <Icon.spinner className="mr-2 h-4 w-4 animate-spin" />}
            <span>保存</span>
          </button>
        </div>
        <div className="prose prose-stone mx-auto w-[800px] dark:prose-invert">
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={post.title}
            placeholder="Post title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            {...register("title")}
          />
          <div id="editor" className="min-h-[500px]" />
          <p className="text-sm text-gray-500">
            Use
            <kbd className="rounded-md border bg-muted px-2 mx-2 text-xs uppercase">
              Tab
            </kbd>
            to open the command menu.
          </p>
        </div>
      </div>
    </form>
  );
}
