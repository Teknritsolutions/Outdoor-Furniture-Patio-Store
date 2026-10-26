# Reference study

The web tool could not access any of the five supplied URLs, and interactive browser providers were unavailable. Installed Chromium subsequently returned HTTP 200 for all five pages. Measured navigation, headings, typography, and container widths are saved in `reference-analysis.json`; desktop and mobile captures are in `tests/references/`.

| Reference | Observed structure and measurements | Terravelle application |
|---|---|---|
| Local Farm / CSA | Full-width photographic hero; alternating story and process sections; 16px body with generous line-height; containers with 20px padding | Comfortable reading width, clear process steps, consistent gutters |
| High-End Event Planning | Photographic overlay hero; serif-led hierarchy; 1200px inner-section containers | Distinct second-homepage hero, calm serif hierarchy; typography follows the requested smaller sizes |
| Local Indie Bookstore | Split hero; 1200px containers; 48px H1 and 36px section headings; product grids, categories, testimonials, newsletter | Contained split hero, equal-height catalog cards, clear section rhythm |
| Food Truck menu | Page-title hero; category controls; three-column menu grid; featured item; closing CTA | Accessible category filtering, regular catalog grid, editorial product feature |
| Boutique Yarn & Craft | Split introductory layout, warm backgrounds, 1280px containers with 32px padding, 44px section headings | Warm palette, editorial content, balanced imagery and responsive gutters |

Navigation patterns were inspected from the live DOM. Several references include dashboards, authentication, and purchase flows; the Terravelle brief expressly excludes those features. Terravelle uses its required Home dropdown, seven main destinations, theme control, and showroom CTA.

Some full-page captures show content that has not yet animated or lazy-loaded into view. Measurements and this summary describe the accessible, observed structure; blank captured areas are not treated as design recommendations. Brand identities, copy, logos, and photos were not copied.
