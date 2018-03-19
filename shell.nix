with import <nixpkgs> { };

stdenv.mkDerivation {
  name = "enable-packages";

  buildInputs = [
    nodejs
  ];
}
