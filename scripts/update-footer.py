"""Update footer across all source HTML files:
- Add personal LinkedIn buttons for Youssef and Malak after company LinkedIn
- Add malak@vahorizon.site to Contact section
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

EXCLUDE_DIRS = {
    '_site', 'node_modules', '.git', 'scripts', 'src', 'output',
    'content', 'docs', '.claude', '.agents', '.vscode'
}

LINKEDIN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">\n       <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.1 20.45H3.54V9H7.1v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"></path>\n      </svg>'

PERSONAL_BUTTONS = (
    '\n     <a href="https://www.linkedin.com/in/youssef-ahmed-255966380/" target="_blank" rel="noopener noreferrer" '
    'aria-label="Youssef Ahmed on LinkedIn" class="inline-flex h-10 w-10 items-center justify-center rounded-md '
    'border border-white/15 text-gray-300 transition-colors hover:border-va-gold hover:text-va-gold">\n'
    '      ' + LINKEDIN_SVG + '\n     </a>'
    '\n     <a href="https://www.linkedin.com/in/malak-maher-b13020381/" target="_blank" rel="noopener noreferrer" '
    'aria-label="Malak Maher on LinkedIn" class="inline-flex h-10 w-10 items-center justify-center rounded-md '
    'border border-white/15 text-gray-300 transition-colors hover:border-va-gold hover:text-va-gold">\n'
    '      ' + LINKEDIN_SVG + '\n     </a>'
)

MALAK_EMAIL_LI = '\n     <li><a href="mailto:malak@vahorizon.site" class="hover:text-va-gold transition-colors">malak@vahorizon.site</a></li>'

# Marker: end of company LinkedIn button in footer social section
COMPANY_LINKEDIN_END = 'aria-label="VA Horizon on LinkedIn"'
SOCIAL_END_MARKER = '     </a>\n    </div>\n   </div>'

YOUSSEF_LI = '<li><a href="mailto:youssef@vahorizon.site" class="hover:text-va-gold transition-colors">youssef@vahorizon.site</a></li>'


def collect_html_files():
    files = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        # Prune excluded dirs in-place
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for fname in filenames:
            if fname.endswith('.html'):
                files.append(os.path.join(dirpath, fname))
    return files


def update_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    # 1. Add personal LinkedIn buttons if footer has company LinkedIn but not personal ones
    if (COMPANY_LINKEDIN_END in content
            and 'linkedin.com/in/youssef-ahmed' not in content
            and SOCIAL_END_MARKER in content):
        # Insert personal buttons before the closing </div> of the social links container
        content = content.replace(SOCIAL_END_MARKER, PERSONAL_BUTTONS + '\n' + SOCIAL_END_MARKER, 1)
        changed = True

    # 2. Add malak's email if youssef's email is in the footer but malak's isn't
    if (YOUSSEF_LI in content and 'malak@vahorizon.site' not in content):
        content = content.replace(
            YOUSSEF_LI,
            YOUSSEF_LI + MALAK_EMAIL_LI,
            1
        )
        changed = True

    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


def main():
    files = collect_html_files()
    updated = 0
    skipped = 0
    for path in files:
        if update_file(path):
            updated += 1
            print(f'  updated: {os.path.relpath(path, ROOT)}')
        else:
            skipped += 1
    print(f'\nDone: {updated} updated, {skipped} unchanged')


if __name__ == '__main__':
    main()
