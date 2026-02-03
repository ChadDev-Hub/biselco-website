"use server"

import React from 'react'
import { SingleImagePost, QuiltedStyle } from './Image'
type Props = {
    postId: number;
    contentType: string;
    content: string | string[];
}

const NewsContents = async ({ postId, contentType, content }: Props) => {
    switch (contentType) {
        case "image":
            return (
                <>
                    {Array.isArray(content)
                        ? <QuiltedStyle
                            postId={postId}
                            images={content} />
                        : <SingleImagePost
                            postId={postId}
                            src={content} />}

                </>
            );
        default:
            break;
    }
}
export default NewsContents