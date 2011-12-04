module Mulberry
  module Command
    class UpdateThemes
      def initialize(args)
        to_dir = Mulberry::PathHelper.get_app_dir
        Mulberry::App.update_themes to_dir
      end
    end
  end
end
