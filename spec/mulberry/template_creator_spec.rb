require 'spec_helper'
require 'mulberry/template_creator'

describe Mulberry::TemplateCreator do
  before :each do
    @source_dir = 'testapp'
    @template_dir = 'templates'

    Mulberry::App.scaffold(@source_dir, true)
    Mulberry.paths.set_app_dir(@source_dir)
    @app = Mulberry::App.new @source_dir
  end

  after :each do
    FileUtils.rm_rf @source_dir
  end

  it "should create a template with the requested name" do
    Mulberry::TemplateCreator.new('template', 'foo')

    template_dir = File.join @source_dir, @template_dir

    File.exists?(template_dir).should be_true
    Dir.entries(template_dir).include?('foo.yml').should be_true
  end

  it "should create a template" do
    tpl = 'foo'

    Mulberry::TemplateCreator.new('template', tpl)

    template_file = File.join(@source_dir, @template_dir, "#{tpl}.yml")
    template = YAML.load_file(template_file)[tpl]

    template['screens'].should_not be_nil
    template['screens'].length.should be > 0
    template['screens'].first['name'].should_not be_nil
    template['screens'].first['regions'].should_not be_nil
    template['screens'].first['regions'].length.should be > 0
  end
end
