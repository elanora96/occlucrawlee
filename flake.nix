{
  description = "Occlucrawlee Project Flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    git-hooks-nix = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs.nixpkgs-lib.follows = "nixpkgs";
    };
    systems.url = "github:nix-systems/default";
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import inputs.systems;
      imports = [
        inputs.treefmt-nix.flakeModule
        inputs.git-hooks-nix.flakeModule
      ];
      perSystem =
        {
          pkgs,
          lib,
          ...
        }:
        let
          name = "occlucrawlee";
          pname = name;

          src = ./.;
          npmRoot = src;

          inherit (pkgs) importNpmLock;
          nodejs = pkgs.nodejs_latest;

          meta = {
            description = "A Web Spider for Horg.com";
            longDescription = ''
              A Crawlee Web Spider for Horg.com, collects information on known Occlupanids.
            '';
            # homepage = "";
            license = lib.licenses.isc;
            maintainers = [
              {
                name = "Elanora Manson";
                email = "git@elanora.lol";
                github = "elanora96";
                githubId = 27848938;
              }
            ];
            platforms = lib.platforms.all;
          };

          buildInputs = [ nodejs ];

          program = pkgs.writeShellScript "run-crawlee.sh" ''
            node ./result/dist/main.js
          '';
        in
        {
          apps.default = {
            type = "app";
            program = "${program}";
          };

          packages.default = pkgs.buildNpmPackage {
            inherit
              name
              pname
              src
              meta
              buildInputs
              ;

            npmDeps = importNpmLock { inherit npmRoot; };
            inherit (importNpmLock) npmConfigHook;

            installPhase = ''
              mkdir -p $out
              cp -r ./dist $out/dist
            '';
          };

          devShells.default = pkgs.mkShell {
            buildInputs = buildInputs ++ [ pkgs.biome ];
            name = "${name}-shell";
            packages = [
              importNpmLock.hooks.linkNodeModulesHook
              nodejs
            ];
            npmDeps = importNpmLock.buildNodeModules {
              inherit nodejs npmRoot;
            };
          };

          pre-commit.settings.hooks = {
            treefmt.enable = true;
          };

          treefmt = {
            projectRootFile = "flake.nix";
            programs = {
              biome.enable = true;
              mdformat.enable = true;
              nixfmt.enable = true;
            };
          };
        };
    };
}
