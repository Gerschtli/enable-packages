'use babel';

import EnablePackages from '../lib/enable-packages';

describe('enable-packages', () => {
  let view;

  beforeEach(() => {
    view = atom.views.getView(atom.workspace);

    waitsForPromise(() => atom.packages.activatePackage('notifications'));
  });

  it('disables all optional packages on activate', () => {
    atom.config.set('enable-packages.optionalPackages', ['tree-view', 'whitespace']);
    expect(atom.packages.isPackageDisabled('tree-view')).toBe(false);
    expect(atom.packages.isPackageDisabled('whitespace')).toBe(false);

    waitsForPromise(() => atom.packages.activatePackage('enable-packages'));

    runs(() => {
      expect(atom.packages.isPackageDisabled('tree-view')).toBe(true);
      expect(atom.packages.isPackageDisabled('whitespace')).toBe(true);

      const notificationContainer = view.querySelector('atom-notifications');
      expect(notificationContainer.childNodes.length).toBe(1);

      const notification = notificationContainer.querySelector('atom-notification.success');
      expect(notification).toHaveClass('success');
      expect(notification.querySelector('.message').textContent.trim()).toBe('Packages disabled');

      const detailNodes = notification.querySelector('.detail-content').childNodes;
      expect(detailNodes.length).toBe(2);
      expect(detailNodes[0].textContent.trim()).toBe('tree-view');
      expect(detailNodes[1].textContent.trim()).toBe('whitespace');
    });
  });

  describe('when enable packages is activated', () => {
    beforeEach(() => {
      atom.config.set('enable-packages.optionalPackages', ['about', 'tree-view', 'whitespace']);

      waitsForPromise(() => atom.packages.activatePackage('enable-packages'));
    });

    it('toggles packages on project change', () => {
      const notificationContainer = view.querySelector('atom-notifications');

      const projectManager = {
        onProjectChange: null,
        getProject(callback) {
          this.onProjectChange = callback;
        },
      };

      EnablePackages.setProjectManagerService(projectManager);

      // clear notifications
      notificationContainer.childNodes.forEach((x) => {
        notificationContainer.removeChild(x);
      });

      const projectOne = {
        getProps() {
          return {
            enable_packages: ['about', 'tree-view'],
          };
        },
      };

      (projectManager.onProjectChange)(projectOne);

      expect(atom.packages.isPackageDisabled('about')).toBe(false);
      expect(atom.packages.isPackageDisabled('tree-view')).toBe(false);
      expect(atom.packages.isPackageDisabled('whitespace')).toBe(true);

      expect(notificationContainer.childNodes.length).toBe(1);

      const notification = notificationContainer.querySelector('atom-notification.success');
      expect(notification).toHaveClass('success');
      expect(notification.querySelector('.message').textContent.trim()).toBe('Packages enabled');

      const detailNodes = notification.querySelector('.detail-content').childNodes;
      expect(detailNodes.length).toBe(2);
      expect(detailNodes[0].textContent.trim()).toBe('about');
      expect(detailNodes[1].textContent.trim()).toBe('tree-view');

      // clear notifications
      notificationContainer.childNodes.forEach((x) => {
        notificationContainer.removeChild(x);
      });

      const projectTwo = {
        getProps() {
          return {
            enable_packages: ['about', 'whitespace'],
          };
        },
      };

      (projectManager.onProjectChange)(projectTwo);

      expect(atom.packages.isPackageDisabled('about')).toBe(false);
      expect(atom.packages.isPackageDisabled('tree-view')).toBe(true);
      expect(atom.packages.isPackageDisabled('whitespace')).toBe(false);

      expect(notificationContainer.childNodes.length).toBe(2);

      const notificationDisable = notificationContainer.childNodes[0];
      expect(notificationDisable).toHaveClass('success');
      expect(notificationDisable.querySelector('.message').textContent.trim()).toBe('Packages disabled');

      const detailNodesDisable = notificationDisable.querySelector('.detail-content').childNodes;
      expect(detailNodesDisable.length).toBe(1);
      expect(detailNodesDisable[0].textContent.trim()).toBe('tree-view');

      const notificationEnable = notificationContainer.childNodes[1];
      expect(notificationEnable).toHaveClass('success');
      expect(notificationEnable.querySelector('.message').textContent.trim()).toBe('Packages enabled');

      const detailNodesEnable = notificationEnable.querySelector('.detail-content').childNodes;
      expect(detailNodesEnable.length).toBe(1);
      expect(detailNodesEnable[0].textContent.trim()).toBe('whitespace');
    });

    it('disables all optional packages on deactivate', () => {
      atom.packages.enablePackage('about');
      atom.packages.enablePackage('tree-view');
      atom.packages.enablePackage('whitespace');

      waitsForPromise(() => atom.packages.deactivatePackage('enable-packages'));

      runs(() => {
        expect(atom.packages.isPackageDisabled('about')).toBe(true);
        expect(atom.packages.isPackageDisabled('tree-view')).toBe(true);
        expect(atom.packages.isPackageDisabled('whitespace')).toBe(true);
      });
    });
  });
});
