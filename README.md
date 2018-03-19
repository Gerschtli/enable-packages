# enable-packages

An [atom](https://atom.io/) package for enabling packages via the
[project manager](https://atom.io/packages/project-manager).

## Usage

Add all packages, which you want to enable per project, in the list of `optionalPackages` in your `~/.atom/config.cson`
like:
```cson
"*":
  "enable-packages":
    optionalPackages: [
      "autocomplete-hack"
      "autocomplete-racer"
    ]
```

Then edit your `~/.atom/projects.cson` (from the project manager package) to add the packages, you want to enable.

For example:
```cson
[
  {
    title: "rust-project"
    paths: [
      "~/projects/rust"
    ]
    enable_packages: [
      "autocomplete-racer"
    ]
  }
  {
    title: "generic-project"
    paths: [
      "~/projects/generic"
    ]
  }
  {
    title: "hack-project"
    paths: [
      "~/projects/hack"
    ]
    enable_packages: [
      "autocomplete-hack"
    ]
  }
]
```

The disabled packages will saved in `core.disabledPackages` in `~/.atom/config.cson`.
If you share your config, be sure to close atom before beforehand, so that all optional packages are listed under the
disabled packages section to minimize startup time, when opening another project.
