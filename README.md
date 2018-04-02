# enable-packages [![Travis CI](https://img.shields.io/travis/Gerschtli/enable-packages.svg?style=flat-square)](https://travis-ci.org/Gerschtli/enable-packages) [![apm](https://img.shields.io/apm/v/enable-packages.svg?style=flat-square)](https://atom.io/packages/enable-packages) [![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT)

An [atom](https://atom.io/) package for enabling packages via the
[project manager](https://atom.io/packages/project-manager).

## Usage

Add all packages, which you want to enable per project, in the list of optional packages in the package config or
manually in the list of `enable-packages.optionalPackages` in your `~/.atom/config.cson` like:
```cson
"*":
  "enable-packages":
    optionalPackages: [
      "autocomplete-hack"
      "autocomplete-racer"
    ]
```

Additionally you can set whether to disable all optional packages by default on atom start before reading the enabled
packages of the current project.
Prevents useless disabling and enabling of the same packages on atom start with the tradeoff that, if atom starts with
a folder not configured as project in the project manager, optional packages could be still enabled.
If project manager is heavily used for every project, it is safe to disable this option.

Then edit your `~/.atom/projects.cson` (from the project manager package) to add the packages, you want to enable, for example:
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

The disabled packages will be saved in `core.disabledPackages` in `~/.atom/config.cson`.
If you share your config, be sure to close atom beforehand, so that all optional packages are listed under the disabled
packages section to minimize startup time when opening another project.
