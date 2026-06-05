'use client';

import React from 'react';
import { AgentExecutionResponse } from '@/types/agent';
import { CheckCircle2, XCircle, Clock, Zap, DollarSign } from 'lucide-react';

interface ExecutionCardProps {
  execution: AgentExecutionResponse;
  agentName: string;
}

export function ExecutionCard({ execution, agentName }: ExecutionCardProps) {
  // Basic markdown to HTML converter
  const formatMarkdown = (text: string): string => {
    if (!text) return '';

    let html = text;

    // Escape HTML
    const escapeHtml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };

    // Split into lines for processing
    const lines = html.split('\n');
    const processed: string[] = [];
    let inCodeBlock = false;
    let codeBlock: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          processed.push(`<pre class="bg-muted border border-border rounded p-3 my-3 overflow-x-auto"><code class="text-xs font-mono text-success whitespace-pre">${codeBlock.join('\n')}</code></pre>`);
          codeBlock = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlock.push(line);
        continue;
      }

      // Headers
      if (line.startsWith('## ')) {
        processed.push(`<h2 class="text-lg font-bold text-accent mt-4 mb-2">${escapeHtml(line.substring(3))}</h2>`);
        continue;
      }
      if (line.startsWith('### ')) {
        processed.push(`<h3 class="text-base font-bold text-accent mt-3 mb-2">${escapeHtml(line.substring(4))}</h3>`);
        continue;
      }

      // Horizontal rule
      if (line.trim() === '---') {
        processed.push('<hr class="border-border my-4" />');
        continue;
      }

      // Lists
      if (line.match(/^[-*] /)) {
        const content = escapeHtml(line.substring(2));
        processed.push(`<li class="ml-4 list-disc">${content}</li>`);
        continue;
      }

      // Regular line
      let processedLine = escapeHtml(line);

      // Bold
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');

      // Italic (but not bold)
      processedLine = processedLine.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic text-muted-foreground">$1</em>');

      // Inline code
      processedLine = processedLine.replace(/`([^`]+)`/g, '<code class="bg-muted border border-border rounded px-1.5 py-0.5 text-xs font-mono text-success">$1</code>');

      // Links
      processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

      processed.push(processedLine);
    }

    // Join and wrap lists
    html = processed.join('\n');
    html = html.replace(/(<li[^>]*>.*?<\/li>)/gs, (match) => {
      if (!match.includes('<ul')) {
        return `<ul class="list-disc ml-6 my-2 space-y-1">${match}</ul>`;
      }
      return match;
    });

    // Convert line breaks
    html = html.split('\n').map(line => {
      if (line.trim() === '' || line.startsWith('<')) {
        return line;
      }
      return `<p class="my-2">${line}</p>`;
    }).join('\n');

    return `<div class="markdown-content">${html}</div>`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const parseResponseToMarkdown = (outputs: any): string => {
    // If it's a string, return as is
    if (typeof outputs === 'string') {
      return outputs;
    }

    // If it's an array of response objects
    if (Array.isArray(outputs)) {
      return outputs.map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        if (typeof item === 'object' && item !== null) {
          let markdown = '';

          // Add role as header if present
          if (item.role) {
            markdown += `## ${item.role}\n\n`;
          }

          // Add content (which may already contain markdown)
          if (item.content) {
            markdown += item.content;
          } else if (item.text) {
            markdown += item.text;
          } else if (item.message) {
            markdown += item.message;
          }

          // Add timestamp if present
          if (item.timestamp) {
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            markdown += `\n\n*${formattedDate}*`;
          }

          return markdown;
        }

        return JSON.stringify(item, null, 2);
      }).join('\n\n---\n\n');
    }

    // If it's a single object with role/content structure
    if (typeof outputs === 'object' && outputs !== null) {
      // Check if it has the response structure (role, content, timestamp)
      if (outputs.role || outputs.content) {
        let markdown = '';

        if (outputs.role) {
          markdown += `## ${outputs.role}\n\n`;
        }

        if (outputs.content) {
          markdown += outputs.content;
        } else if (outputs.text) {
          markdown += outputs.text;
        } else if (outputs.message) {
          markdown += outputs.message;
        } else if (outputs.result) {
          markdown += outputs.result;
        }

        if (outputs.timestamp) {
          const date = new Date(outputs.timestamp);
          const formattedDate = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          markdown += `\n\n*${formattedDate}*`;
        }

        return markdown;
      }

      // Fallback to extracting text fields
      if (outputs.text) return outputs.text;
      if (outputs.content) return outputs.content;
      if (outputs.result) return outputs.result;
      if (outputs.message) return outputs.message;

      // Otherwise, stringify it
      return JSON.stringify(outputs, null, 2);
    }

    return String(outputs);
  };

  const outputText = parseResponseToMarkdown(execution.outputs);

  return (
    <div className="bg-card border border-border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 hover:border-accent transition-all duration-300 w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 min-w-0">
            <h3 className="text-sm font-bold text-foreground font-mono truncate" title={agentName}>
              {agentName}
            </h3>
            {execution.success ? (
              <CheckCircle2 className="w-4 h-4 text-success" />
            ) : (
              <XCircle className="w-4 h-4 text-danger" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono flex-wrap">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="break-all">{formatDate(execution.timestamp)}</span>
            {execution.job_id && (
              <>
                <span className="text-muted-foreground flex-shrink-0">•</span>
                <span className="text-accent/60 break-all">ID: {execution.job_id.slice(0, 8)}</span>
              </>
            )}
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-mono font-semibold flex-shrink-0 self-start ${
          execution.success
            ? 'bg-success/10 text-success border border-success/50'
            : 'bg-danger/10 text-danger border border-danger/50'
        }`}>
          {execution.success ? 'SUCCESS' : 'FAILED'}
        </div>
      </div>

      {/* Agent Info */}
      {(execution.name || execution.description) && (
        <div className="text-xs text-muted-foreground font-mono space-y-1">
          {execution.name && (
            <div>
              <span className="text-muted-foreground">Name:</span>{' '}
              <span className="text-accent">{execution.name}</span>
            </div>
          )}
          {execution.description && (
            <div>
              <span className="text-muted-foreground">Description:</span>{' '}
              <span className="text-foreground/80">{execution.description}</span>
            </div>
          )}
        </div>
      )}

      {/* Output Content */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
          Output
        </div>
        <div className="bg-muted border border-border rounded p-3 sm:p-4 max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto overflow-x-auto prose prose-invert prose-sm max-w-none">
          <div
            className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap break-words markdown-content"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(outputText) }}
          />
        </div>
      </div>

      {/* Usage Stats */}
      {execution.usage && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 pt-2 border-t border-border">
          {execution.usage.input_tokens !== undefined && (
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-accent" />
              <div className="text-xs font-mono">
                <div className="text-muted-foreground">Input</div>
                <div className="text-accent">
                  {execution.usage.input_tokens.toLocaleString()} tokens
                </div>
              </div>
            </div>
          )}
          {execution.usage.output_tokens !== undefined && (
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-success" />
              <div className="text-xs font-mono">
                <div className="text-muted-foreground">Output</div>
                <div className="text-success">
                  {execution.usage.output_tokens.toLocaleString()} tokens
                </div>
              </div>
            </div>
          )}
          {execution.usage.total_tokens !== undefined && (
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-accent" />
              <div className="text-xs font-mono">
                <div className="text-muted-foreground">Total</div>
                <div className="text-accent">
                  {execution.usage.total_tokens.toLocaleString()} tokens
                </div>
              </div>
            </div>
          )}
          {execution.usage.total_cost !== undefined && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-3 h-3 text-success" />
              <div className="text-xs font-mono">
                <div className="text-muted-foreground">Cost</div>
                <div className="text-success">
                  ${execution.usage.total_cost.toFixed(4)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
