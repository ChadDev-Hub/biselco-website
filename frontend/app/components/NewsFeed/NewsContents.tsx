"use server"

import React from 'react'
import { SingleImagePost, MultipleImage } from './Image'
type Props = {
    contentType: string;
    content: string | string[];
}

const NewsContents = async({ contentType, content }: Props) => {
    switch (contentType) {
        case "image":
            return (
                <>
                {content.length > 1 ? <MultipleImage images={content}/> : <SingleImagePost src={content}/> }
                </>
            );
        default:
            break;
    }
}
export default NewsContents