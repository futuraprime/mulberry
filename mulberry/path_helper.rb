# a class to handle pathing

module Mulberry
  class PathHelper
    
    def self.get_root_dir( dir=Dir.pwd )
      # returns the root directory of this mulberry app
      # returns false if this is not a mulberry app
      
      # we're going to detect the root directory by the presence of a
      # mulberry-like directory structure
      
      # get the current dir
      dir = File.expand_path( dir ) # File.expand_path( File.dirname(__FILE__) )
      
      # when we're at the root, these will be equal
      until File.split(dir)[0] == File.split(dir)[1]
        # we found it
        break if isroot?(dir)
        # otherwise, keep iterating
        dir = File.split(dir)[0]
      end
      
      return dir
    end
    
    ROOTFILES = [
      'config.yml',
      'sitemap.yml'
    ]
    
    # checks if a directory is the mulberry root directory
    # we'll content ourselves with looking for config.yml and sitemap.yml
    def self.isroot?(dir)
      ROOTFILES.each do |file|
        check = File.join(dir, file)
        return false unless File.exists?(check)
      end
    end
    
    def self.relative_path(from, to, separator)
      # generates a relative path from one file to another
    end
    
  end
end