"use client";

import {
    DecoratorNode,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
} from 'lexical';
import { Suspense, lazy, type JSX } from 'react';

const ImageComponent = lazy(() => import('./ImageComponent'));

export interface ImagePayload {
    altText: string;
    src: string;
    width?: number;
    height?: number;
    key?: NodeKey;
}

export type SerializedImageNode = Spread<
    {
        type: 'image';
        version: 1;
        altText: string;
        src: string;
        width?: number;
        height?: number;
    },
    SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __altText: string;
    __width: number | 'inherit';
    __height: number | 'inherit';

    static getType(): string {
        return 'image';
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(
            node.__src,
            node.__altText,
            node.__width,
            node.__height,
            node.__key,
        );
    }

    constructor(
        src: string,
        altText: string,
        width?: number | 'inherit',
        height?: number | 'inherit',
        key?: NodeKey,
    ) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__width = width || 'inherit';
        this.__height = height || 'inherit';
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        const { altText, src, width, height } = serializedNode;
        const node = $createImageNode({
            altText,
            src,
            width,
            height,
        });
        return node;
    }

    exportJSON(): SerializedImageNode {
        return {
            altText: this.getAltText(),
            src: this.getSrc(),
            width: typeof this.__width === 'number' ? this.__width : undefined,
            height: typeof this.__height === 'number' ? this.__height : undefined,
            type: 'image',
            version: 1,
        };
    }

    createDOM(): HTMLElement {
        const span = document.createElement('span');
        span.className = 'editor-image';
        return span;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): JSX.Element {
        return (
            <Suspense fallback={null}>
                <ImageComponent
                    src={this.__src}
                    altText={this.__altText}
                    width={this.__width}
                    height={this.__height}
                    nodeKey={this.getKey()}
                />
            </Suspense>
        );
    }

    getSrc(): string {
        return this.__src;
    }
    getAltText(): string {
        return this.__altText;
    }
    getWidth(): number | 'inherit' {
        return this.__width;
    }
    getHeight(): number | 'inherit' {
        return this.__height;
    }

    setWidthHeight(width: number, height: number): void {
        const writable = this.getWritable()
        writable.__width = width
        writable.__height = height
    }
}

export function $createImageNode({
    src,
    altText,
    width,
    height,
    key,
}: ImagePayload): ImageNode {
    return new ImageNode(src, altText, width, height, key);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}