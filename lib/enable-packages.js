'use babel';

export default {

  optionalPackages: [],
  enablePackages: [],

  activate() {
    this.optionalPackages = atom.config.get('enable-packages.optionalPackages');
    this.load();
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
