module Mulberry
  module Command
    class Data
      def initialize(args)
        dir = Mulberry::PathHelper.get_app_dir args[0]
        app = Mulberry::App.new(dir)
        d = JSON.pretty_generate(Mulberry::Data.new(app).generate)
        puts d
      end
    end
  end
end