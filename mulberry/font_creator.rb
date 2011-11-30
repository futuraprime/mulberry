require 'pathname'

module Mulberry
  class FontCreator

    # font creation works a little differently than other factories
    # instead of just creating a font file, they're supplying a path
    # to an existing font file, which we're going to copy into the assets folder

    # also note: this assumes we'll only work with TrueType (TTF) fonts. We may
    # eventually want to support Web OpenType (WOFF) fonts as well. We do not
    # support SVG fonts by default, which would be necessary for iOS version < 4.2
    def initialize(code_type, destination_dir, fontpath)
      fonts_dir = File.join(destination_dir, 'assets', 'fonts')
      # make sure we don't fail due to an old scaffold
      FileUtils.mkdir_p fonts_dir unless File.exists? fonts_dir

      # check what we're copying
      if !File.file? fontpath
        raise "No font file found at #{fontpath}"
      end

      # get the font's filename
      font_fname = File.basename(fontpath)
      font_name = font_fname.split('.')[0]

      if File.exists? File.join(fonts_dir, font_fname)
        raise "Font has already been added"
      end

      # copy the font file over
      FileUtils.cp(fontpath, File.join(fonts_dir, font_fname))
      font_newpath = File.join(fonts_dir, font_fname)

      # ok, now write some CSS to include it
      # get the theme file
      theme_cssfile = 'base.scss'
      themes_dir = File.join(destination_dir, 'themes', Mulberry::App.new(destination_dir).theme)
      FileUtils.mkdir_p themes_dir unless File.exists? themes_dir

      # write the font import into the file
      # TODO: this should really be prepended to base.scss, as it won't work unless it's added
      # ahead of the imports & etc...
      File.open(File.join(themes_dir, theme_cssfile), 'a') do |f|
        pathstring = Pathname.new("#{font_newpath}").relative_path_from(Pathname.new(themes_dir))
        f.write "@font-face {\n\tfont-family: '#{font_name}';\n\tsrc: url(#{pathstring}) format('truetype')\n\tfont-weight: normal;\n\tfont-style:normal;\n}\n"
      end

      puts "Added #{font_name} to the app."
      puts "Added @font-face import to the #{theme_cssfile}. You should customize it as necessary now."

    end
  end
end
