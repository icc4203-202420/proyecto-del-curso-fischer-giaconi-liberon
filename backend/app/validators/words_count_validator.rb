class WordsCountValidator < ActiveModel::EachValidator
    def validate_each(record, attribute, value)
      if value.split.size < options[:minimum]
        record.errors.add(attribute, "must be at least #{options[:minimum]} words long")
      end
    end
  end
  