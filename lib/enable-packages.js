'use babel';

export default {

  config: {
    optionalPackages: {
      title: 'List of all optional packages',
      description: 'Only packages listed here will be disabled by default and can be enabled via `enable_packages` in '
        + 'the config of the project manager package.<br/>Names have to match exactly the package names.',
      type: 'array',
      default: [],
      items: {
        type: 'string',
      },
    },
    resetOnStart: {
      title: 'Disable all optional packages on atom start',
      description: 'Recommended to set to false if project manager is used for every project.',
      type: 'boolean',
      default: true,
    },
  },

  enablePackages: [],
  optionalPackages: [],

  activate() {
    this.optionalPackages = atom.config.get('enable-packages.optionalPackages');

    if (atom.config.get('enable-packages.resetOnStart')) {
      this.load();
    }
  },

  deactivate() {
    this.enablePackages = [];
    this.load();
  },

  setProjectManagerService(projectManager) {
    projectManager.getProject(this.onProjectChange.bind(this));
  },

  onProjectChange(project) {
    if (!project) {
      return;
    }

    this.enablePackages = project.getProps().enable_packages;
    if (typeof this.enablePackages === 'undefined') {
      this.enablePackages = [];
    }
    this.load();
  },

  load() {
    const currentDisabled = atom.config.get('core.disabledPackages').filter(x => this.optionalPackages.includes(x));
    const disablePackages = this.optionalPackages.filter(x => !this.enablePackages.includes(x));

    const disable = disablePackages.filter(x => !currentDisabled.includes(x)).sort();
    const enable = currentDisabled.filter(x => !disablePackages.includes(x)).sort();

    this.togglePackages(disable, false);
    this.togglePackages(enable, true);
    this.sortDisabledPackages();

    this.notify('Packages disabled', disable);
    this.notify('Packages enabled', enable);
  },

  sortDisabledPackages() {
    const disablePackages = atom.config.get('core.disabledPackages');
    disablePackages.sort();
    atom.config.set('core.disabledPackages', disablePackages);
  },

  togglePackages(list, enable) {
    list.forEach((name) => {
      this.togglePackage(name, enable);
    });
  },

  togglePackage(name, enable) {
    if (enable) {
      atom.packages.enablePackage(name);
    } else {
      atom.packages.disablePackage(name);
    }
  },

  notify(message, list) {
    if (list.length) {
      atom.notifications.addSuccess(
        message,
        {
          detail: list.join('\n'),
        }
      );
    }
  },

};
