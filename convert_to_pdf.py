"""
Convert Markdown Project Report to PDF
Uses markdown library to convert to HTML, then creates a styled PDF
"""

import markdown
from pathlib import Path

# Read the markdown file
md_file = Path(r"C:\Users\rakes\.gemini\antigravity\brain\01a537e7-baa2-4500-9dc6-fd2b8162229e\JobMatcher_AI_Project_Report.md")
output_html = Path(r"d:\JobMatcher Web\JobMatcher_AI_Project_Report.html")
output_dir = Path(r"d:\JobMatcher Web")

md_content = md_file.read_text(encoding='utf-8')

# Convert markdown to HTML with extensions
html_content = markdown.markdown(
    md_content,
    extensions=['tables', 'fenced_code', 'toc', 'nl2br']
)

# Create full HTML with styling
full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JobMatcher AI Portal - Project Report</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code&display=swap');
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.8;
            color: #1a1a2e;
            background: #ffffff;
            padding: 40px 60px;
            max-width: 900px;
            margin: 0 auto;
        }}
        
        h1 {{
            font-size: 2.2rem;
            font-weight: 700;
            color: #1a1a2e;
            margin: 2rem 0 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #6366f1;
            page-break-after: avoid;
        }}
        
        h2 {{
            font-size: 1.6rem;
            font-weight: 600;
            color: #2d2d44;
            margin: 1.5rem 0 0.8rem;
            page-break-after: avoid;
        }}
        
        h3 {{
            font-size: 1.3rem;
            font-weight: 600;
            color: #3d3d5c;
            margin: 1.2rem 0 0.6rem;
            page-break-after: avoid;
        }}
        
        h4 {{
            font-size: 1.1rem;
            font-weight: 600;
            color: #4a4a6a;
            margin: 1rem 0 0.5rem;
        }}
        
        p {{
            margin: 0.8rem 0;
            text-align: justify;
        }}
        
        ul, ol {{
            margin: 0.8rem 0;
            padding-left: 2rem;
        }}
        
        li {{
            margin: 0.4rem 0;
        }}
        
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            font-size: 0.9rem;
            page-break-inside: avoid;
        }}
        
        th {{
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            font-weight: 600;
            padding: 12px 16px;
            text-align: left;
            border: 1px solid #ddd;
        }}
        
        td {{
            padding: 10px 16px;
            border: 1px solid #e2e8f0;
            background: #fafafa;
        }}
        
        tr:nth-child(even) td {{
            background: #f1f5f9;
        }}
        
        code {{
            font-family: 'Fira Code', monospace;
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.85rem;
            color: #6366f1;
        }}
        
        pre {{
            background: #1e1e2e;
            color: #cdd6f4;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1.5rem 0;
            font-family: 'Fira Code', monospace;
            font-size: 0.85rem;
            line-height: 1.6;
            page-break-inside: avoid;
        }}
        
        pre code {{
            background: none;
            color: inherit;
            padding: 0;
        }}
        
        blockquote {{
            border-left: 4px solid #6366f1;
            padding-left: 1.5rem;
            margin: 1.5rem 0;
            color: #64748b;
            font-style: italic;
            background: #f8fafc;
            padding: 1rem 1.5rem;
            border-radius: 0 8px 8px 0;
        }}
        
        hr {{
            border: none;
            height: 2px;
            background: linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7);
            margin: 2rem 0;
        }}
        
        strong {{
            font-weight: 600;
            color: #1a1a2e;
        }}
        
        em {{
            color: #6366f1;
        }}
        
        /* Page break classes */
        .page-break {{
            page-break-after: always;
        }}
        
        /* Title page styling */
        .title-page {{
            text-align: center;
            padding: 100px 0;
        }}
        
        /* Chapter header styling */
        h1 + h1 {{
            border-top: 2px solid #e2e8f0;
            padding-top: 2rem;
            margin-top: 3rem;
        }}
        
        /* Mermaid diagram placeholder */
        .mermaid-placeholder {{
            background: #f8fafc;
            border: 2px dashed #6366f1;
            padding: 40px;
            text-align: center;
            color: #64748b;
            border-radius: 8px;
            margin: 1.5rem 0;
        }}
        
        /* Print styles */
        @media print {{
            body {{
                padding: 20px;
                font-size: 11pt;
            }}
            
            h1 {{
                font-size: 18pt;
            }}
            
            h2 {{
                font-size: 14pt;
            }}
            
            h3 {{
                font-size: 12pt;
            }}
            
            pre {{
                white-space: pre-wrap;
                word-wrap: break-word;
            }}
            
            table {{
                font-size: 9pt;
            }}
        }}
        
        /* Cover styling */
        .cover-title {{
            font-size: 2.5rem;
            color: #6366f1;
            margin-bottom: 1rem;
        }}
        
        .cover-subtitle {{
            font-size: 1.5rem;
            color: #64748b;
        }}
    </style>
</head>
<body>
    {html_content}
    
    <script>
        // Convert mermaid code blocks to placeholders for PDF
        document.querySelectorAll('pre code').forEach(block => {{
            if (block.textContent.includes('graph') || block.textContent.includes('flowchart') || block.textContent.includes('erDiagram')) {{
                const placeholder = document.createElement('div');
                placeholder.className = 'mermaid-placeholder';
                placeholder.innerHTML = '<strong>📊 Diagram</strong><br><small>See rendered version in the Markdown file or use a Mermaid viewer</small>';
                block.parentElement.replaceWith(placeholder);
            }}
        }});
    </script>
</body>
</html>
"""

# Save HTML file
output_html.write_text(full_html, encoding='utf-8')
print(f"✅ HTML report saved to: {output_html}")
print(f"")
print("📄 To convert to PDF, you can:")
print("   1. Open the HTML file in Chrome/Edge browser")
print("   2. Press Ctrl+P (Print)")
print("   3. Select 'Save as PDF' as the destination")
print("   4. Click Save")
print("")
print(f"   HTML File: {output_html}")
