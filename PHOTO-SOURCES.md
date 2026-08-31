# KURDTOKEN — Real City Photos

The map loads one real city photograph per city from Wikimedia Commons at runtime.

Why runtime loading? This avoids bundling 101 third-party images into the repository and lets each image remain linked to its original Commons file page and license metadata.

The code requests a matching image for the selected city, shows the author/license/source credit, and falls back gracefully if no suitable image is returned.

Wikimedia Commons licensing rules require checking each individual file and following its attribution/license requirements.
