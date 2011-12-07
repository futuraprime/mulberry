require 'spec_helper'
require 'mulberry/path_helper'

describe Mulberry::PathHelper do
  before :each do
    @source_dir = 'testapp'

    Dir.chdir Mulberry::Directories.root
    FileUtils.rm_rf @source_dir
    Mulberry::App.scaffold(@source_dir, true)
  end

  after :each do
    FileUtils.rm_rf @source_dir
  end

  it 'should return a path error when not in a mulberry app' do
    lambda {
      Mulberry::PathHelper.get_app_dir Dir.pwd
    }.should raise_error PathError
  end

  it 'should find a mulberry app when in it' do
    target = File.expand_path(@source_dir)
    Dir.chdir(File.join(Mulberry::Directories.root, @source_dir))
    Mulberry::PathHelper.get_app_dir().should == target
  end

  it 'should find a mulberry app from a directory string' do
    Mulberry::PathHelper.get_app_dir(@source_dir).should == File.expand_path(@source_dir)
  end

  it 'should find a mulberry app from inside the directory' do
    Mulberry::PathHelper.get_app_dir(File.join(@source_dir, 'javascript')).should == File.expand_path(@source_dir)
    Mulberry::PathHelper.get_app_dir(File.join(@source_dir, 'themes')).should == File.expand_path(@source_dir)
    Mulberry::PathHelper.get_app_dir(File.join(@source_dir, 'javascript', 'components')).should == File.expand_path(@source_dir)
    Mulberry::PathHelper.get_app_dir(File.join(@source_dir, 'data', 'assets')).should == File.expand_path(@source_dir)
    Mulberry::PathHelper.get_app_dir(File.join(@source_dir, 'themes', 'default', 'components')).should == File.expand_path(@source_dir)
  end

end