'use babel';

export default {

  optionalPackages: null,

  activate() {
    this.optionalPackages = atom.config.get('enable-packages.optionalPackages');

    this.disableOptionals();
  },

  deactivate() {
    this.disableOptionals();
  },

  setProjectManagerService(projectManager) {
    projectManager.getProject(this.onProjectChange.bind(this));
  },

  onProjectChange(project) {
    if (!project) {
      return;
    }

    const enablePackages = project.getProps().enable_packages;

    this.disableOptionals();
    this.togglePackages(enablePackages, true);
  },

  disableOptionals() {
    this.togglePackages(this.optionalPackages, false);
  },

  togglePackages(list, enable) {
    if (!list) {
      return;
    }

    list.forEach((name) => {
      this.togglePackage(name, enable);
    });
  },

  togglePackage(name, enable) {
    if (atom.packages.isPackageDisabled(name) !== enable) {
      return;
    }

    if (enable) {
      atom.packages.enablePackage(name);
    } else {
      atom.packages.disablePackage(name);
    }
  },

};
