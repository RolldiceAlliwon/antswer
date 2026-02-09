import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/social-icons.scss"

interface SocialLink {
  href: string
  label: string
  svg: string
}

const links: SocialLink[] = [
  {
    href: "https://khy07181.github.io/index.xml",
    label: "RSS",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.5 4A1.5 1.5 0 0 0 3 5.5V7A1.5 1.5 0 0 0 4.5 8.5C12.04 8.5 17.5 13.96 17.5 21.5A1.5 1.5 0 0 0 19 23h1.5A1.5 1.5 0 0 0 22 21.5C22 11.835 14.165 4 4.5 4zm0 7A1.5 1.5 0 0 0 3 12.5V14A1.5 1.5 0 0 0 4.5 15.5 5.5 5.5 0 0 1 10 21a1.5 1.5 0 0 0 1.5 1.5H13A1.5 1.5 0 0 0 14.5 21C14.5 15.701 10.299 11.5 5 11.5zM5 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>`
  },
  {
    href: "mailto:khy07181@gmail.com",
    label: "Email",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>`,
  },
  {
    href: "https://github.com/khy07181",
    label: "GitHub",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.95 5.28.95 11.55c0 4.86 3.15 8.98 7.52 10.43.55.1.75-.24.75-.53 0-.26-.01-1.14-.02-2.06-3.06.66-3.71-1.29-3.71-1.29-.5-1.27-1.22-1.61-1.22-1.61-.99-.67.07-.66.07-.66 1.1.08 1.67 1.13 1.67 1.13.98 1.67 2.58 1.19 3.21.9.1-.72.38-1.19.69-1.46-2.44-.28-5-1.22-5-5.44 0-1.2.43-2.19 1.13-2.96-.11-.28-.49-1.41.11-2.94 0 0 .92-.29 3.02 1.13.87-.24 1.81-.36 2.74-.36.93 0 1.87.12 2.74.36 2.1-1.42 3.02-1.13 3.02-1.13.6 1.53.22 2.66.11 2.94.7.77 1.13 1.76 1.13 2.96 0 4.23-2.56 5.16-5.01 5.43.39.34.74 1.01.74 2.05 0 1.48-.01 2.67-.01 3.03 0 .29.2.64.76.53 4.36-1.45 7.51-5.57 7.51-10.43C23.05 5.28 18.27.5 12 .5z"/></svg>`,
  },
]

export default ((opts?: unknown) => {
  const SocialIcons: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    return (
      <div class="social-icons">
        {links.map((l) => (
          <a class="social-link" href={l.href} aria-label={l.label} rel="me noopener noreferrer" target={l.href.startsWith("http") ? "_blank" : undefined}>
            <span class="icon" dangerouslySetInnerHTML={{ __html: l.svg }} />
          </a>
        ))}
      </div>
    )
  }

  SocialIcons.css = style
  return SocialIcons
}) satisfies QuartzComponentConstructor
