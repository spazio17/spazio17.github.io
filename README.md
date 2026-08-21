# spazio17.github.io

The umbrella site for the spazio17 organisation, served by GitHub Pages at
**https://spazio17.org/**.

GitHub Pages serves an organisation's apex site *only* from a repo named exactly
`<org>.github.io`, which is why this is separate from the product sites. It is deliberately generic:
the org may hold more than one product, and each product takes its own subdomain
(`muralis.spazio17.org`, and so on). Pages allows one custom domain per repo, so the split is
structural rather than cosmetic.

Plain static HTML and CSS. No Jekyll (`.nojekyll` is present), no build step.

## Adding a project

Add a `.card` to the Projects section of `index.html`, linking to its own subdomain. Keep the
`.tag` honest about status — "In development" until something is actually published.

## The palette

`assets/css/site.css` is the same stylesheet the product sites use: the Catppuccin palette the
Muralis app itself ships, Mocha for dark and Latte for light. It is a copy, not a shared asset —
Pages has no way to share files across repos — so a change worth making here is probably worth
porting to `muralis-site` too.

## Deploying

Push to `main`. Pages serves it.

The custom domain is configured in **Settings → Pages → Custom domain**, which commits a `CNAME`
file to this repo automatically. `spazio17.org` needs apex `A`/`AAAA` records to GitHub Pages'
addresses (`185.199.108–111.153` and the matching IPv6), plus optionally a `CNAME` for `www`. Leave
*Enforce HTTPS* off until the certificate is issued, then turn it on.
