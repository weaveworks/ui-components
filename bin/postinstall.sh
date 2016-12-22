#!/bin/bash
# Copies components dir to lib/ and flattens for partial imports.
components=$(find src/components -name '*.js' |  awk '!/test/ && !/index/ && !/example/')
mkdir -p lib/ &&
cp src/components/index.js lib &&
for c in $components; do
  name=$(basename $c)
  cp $c lib/$name
done
