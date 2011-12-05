require 'active_support/inflector'

module Mulberry
  class CodeCreator
    def initialize(code_type, destination_dir, filename)
      dirnames = {
        'component'   =>  'components',
        'capability'  =>  'capabilities',
        'datasource'  =>  'data',
        'base'        =>  '.'
      }

      raise "Don't know how to create code type #{code_type}" unless dirnames[code_type]

      code_templates_dir = File.join(Mulberry::Directories.templates, 'code')
      template = File.read(File.join(code_templates_dir, "#{code_type}.js"))

      js_dir = Mulberry::PathHelper.get_dir('javascript')
      code_dir = Mulberry::PathHelper.get_dir('javascript/' + dirnames[code_type])
      theme_cssfile = "base.scss"

      code_filename = File.join(code_dir, "#{filename}.js")

      if File.exists? code_filename
        raise "The file #{code_filename} already exists"
      end

      FileUtils.mkdir_p(code_dir) unless File.exists?(code_dir)

        # write the basic file for the requested code
      File.open(File.join(code_dir, "#{filename}.js"), 'w') do |f|
        f.write template.gsub('{{name}}', filename)
      end

      # add the dependency
      File.open(File.join(js_dir, 'base.js'), 'a') do |f|
        f.write "dojo.require('client.#{dirnames[code_type]}.#{filename}');\n"
      end unless code_type == 'base'

      puts "Created #{code_type} at #{code_filename}"

      # handle any special needs for the requested type of code
      if code_type === 'component'
        # create the resource dir for the component
        component_resource_dir = File.join(code_dir, filename)
        FileUtils.mkdir_p(component_resource_dir) unless File.exists? component_resource_dir

        # get file templates
        haml_template = File.read(File.join(code_templates_dir, "#{code_type}.haml"))
        scss_template = File.read(File.join(code_templates_dir, "#{code_type}.scss"))

        # create the basic haml template for the component
        File.open(File.join(component_resource_dir, "#{filename}.haml"), 'w') do |f|
          f.write haml_template.gsub('{{name}}', filename).gsub('{{dashname}}', filename.underscore.dasherize.downcase)
        end

        # create the SCSS file for the component
        File.open(File.join(component_resource_dir, "_#{filename.underscore.dasherize.downcase}.scss"), 'w') do |f|
          f.write scss_template.gsub('{{name}}', filename).gsub('{{dashname}}', filename.underscore.dasherize.downcase)
        end

        # add the import statement to the theme css file
        themes_dir = Mulberry::PathHelper.get_dir('active_theme')

        FileUtils.mkdir_p themes_dir unless File.exists? themes_dir

        File.open(File.join(themes_dir, theme_cssfile), 'a') do |f|
          pathstring = Mulberry::PathHelper.relative_path("#{code_dir}/#{filename}/#{filename.underscore.dasherize.downcase}", themes_dir)
          f.write "@import '#{pathstring}';\n"
        end

        puts "Template is at #{File.join(component_resource_dir, "#{filename}.haml")}"
        puts "Styles are at #{File.join(component_resource_dir, "_#{filename.underscore.dasherize.downcase}.scss")}"
      end
    end
  end
end
