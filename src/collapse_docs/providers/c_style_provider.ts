import { DocFoldingProvider } from './doc_folding_provider';

export class CStyleFoldingProvider extends DocFoldingProvider {
    languageIds = ['c', 'cpp', 'java', 'csharp', 'rust'];
    // Block comments (`/* ... */`, including `/** */` and `/*! */`) and
    // runs of two or more consecutive line comments (`//`, including `///` and `//!`).
    protected docRegex = /\/\*[\s\S]*?\*\/|^[ \t]*\/\/.*(?:\r?\n[ \t]*\/\/.*)+/gm;
}
