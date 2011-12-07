require 'content_creator'

module Mulberry
  module Command
    class Scaffold
      def initialize(args = [])
        dir = args[0]


        begin
          # check if we're in a directory
          Mulberry::PathHelper.get_app_dir dir

          # if we hit a directory, we shouldn't scaffold
          raise "You cannot scaffold an app inside another app"

        rescue PathError
          # only proceed if we *don't* hit a PathError
          # that is, we shouldn't be able to scaffold an app if we're
          # already in one
          raise "You must specify an app name" unless dir

          dir = dir.gsub(File.join(Dir.pwd, ""), "")
          Mulberry::App.scaffold(dir)
        end
      end
    end
  end
end
