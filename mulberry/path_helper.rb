# a class to handle pathing

# we're going to create our own special type of error
# so we can rescue them later

# a PathError is raised when you're not in a mulberry
# directory, and can be rescued selectively if that's not a problem
class PathError < StandardError
  # nothing to see here
end

module Mulberry
  class PathHelper

    # the definition of a mulberry directory
    # a directory returns true as the mulberry root directory if it contains
    # these files and directories
    ROOTFILES = [
      'config.yml',
      'sitemap.yml'
    ]

    # shortcuts for important directories
    # these use standard slashes--they get corrected later in cases where
    # the directory standard isn't a forward slash
    DIRECTORIES = {
      'component'         => 'javascript/components',
      'capability'        => 'javascript/capabilities',
      'themes'            => 'themes'
    }

    # checks if a directory is the mulberry root directory
    # we'll content ourselves with looking for config.yml and sitemap.yml
    def is_root?(dir)
      ROOTFILES.each do |file|
        check = File.join(dir, file)
        return false unless File.exists?(check)
      end
    end


    # gets the app directory, falling back on the one already cached or set if
    def get_app_dir( dir=nil )
      return @app_dir if @app_dir
      @app_dir = _get_app_dir( dir )
    end


    # set_app_dir lets us override the class' good sense and tell it where
    # the app directory is. this is basically so we can run tests
    def set_app_dir( app_dir )
      @app_dir = app_dir
    end


    # clear_app_dir lets us blank path helper's memory
    # also fol tests
    def clear_app_dir
      @app_dir = nil
    end


    # gets the absolute path to a particular directory in this mulberry app
    def get_dir( target, dir=Dir.pwd )
      dir = self.get_app_dir( dir )

      # active theme is handled separately
      return get_active_theme_dir dir if (target == 'active_theme')

      # see if it's a special directory otherwise
      target = DIRECTORIES[target] if DIRECTORIES.has_key?(target)

      # return the joined directory path
      # note: we split target on '/' first, so that we can program in forward
      # slash and have File.join convert them for other directory systems later
      # e.g. it will convert 'g/components' to 'javascript\components'
      # for Windows
      File.join(dir, target.split('/'))
    end


    private

    # returns the absolute path to the root directory of this mulberry app
    # returns false if this is not a mulberry app
    def _get_app_dir( dir=nil )
      # we're going to detect the root directory by the presence of a
      # mulberry-like directory structure

      # get the current dir
      # this may get passed 'nil' occasionally, so we make sure we
      # have a directory first
      dir ||=Dir.pwd
      dir = File.expand_path( dir )

      # when we're at the root, these will be equal
      # TODO: make sure this check works on Windows as well as UNIX
      until File.split(dir)[0] == File.split(dir)[1]
        # we found it
        return dir if is_root?(dir)
        # otherwise, keep iterating
        dir = File.split(dir)[0]
      end

      # we reached the end of the directory structure & didn't find it, so give up
      raise PathError, "You must run this command from inside a valid Mulberry app."
    end


    # gets the directory of the active theme
    def get_active_theme_dir( dir=Dir.pwd )
      dir = self.get_app_dir( dir )
      File.join( dir, DIRECTORIES['themes'], Mulberry::App.new(dir).theme)
    end
  end
end