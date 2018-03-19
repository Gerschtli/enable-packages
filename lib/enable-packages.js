'use babel';

export default {

  optionalPackages: null,

  activate() {
    this.optionalPackages = atom.config.get('enable-packages.optionalPackages');

    this.togglePackages(this.optionalPackages, false);
  },

  deactivate() {
    this.togglePackages(this.optionalPackages, true);
  },

  setProjectManagerService(projectManager) {
    projectManager.getProject(this.onProjectChange);
  },

  onProjectChange(project) {
    if (!project) {
      return;
    }

    const enablePackages = project.getProps().enable_packages;

    this.togglePackages(this.optionalPackages, false);
    this.togglePackages(enablePackages, true);
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
