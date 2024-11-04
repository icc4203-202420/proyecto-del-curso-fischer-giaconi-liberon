class GenerateEventVideoJob < ApplicationJob
  queue_as :default

  def perform(event_id)
    event = Event.find_by(id: event_id)
    return unless event

    # Obtener las imágenes desde Active Storage
    images = event.event_pictures.map { |picture| picture.image.download }

    Rails.logger.info("Número de imágenes encontradas: #{images.count}")

    return unless images.any?

    # Crear un directorio temporal para las imágenes
    temp_dir = Rails.root.join('tmp', 'event_videos', "event_#{event_id}")
    FileUtils.mkdir_p(temp_dir) unless File.exist?(temp_dir)

    # Guardar las imágenes en el directorio temporal
    image_files = images.each_with_index.map do |image_data, index|
      image_path = temp_dir.join("image_#{index}.jpg")
      File.open(image_path, 'wb') { |file| file.write(image_data) }
      image_path.to_s # devuelve la ruta como string
    end

    Rails.logger.info("Número de archivos de imagen guardados: #{image_files.count}")
    Rails.logger.info("Rutas de imágenes guardadas: #{image_files.join(', ')}")

    output_path = Rails.root.join('public', 'videos', "event_#{event_id}.mp4")

    # Formar el comando de ffmpeg
    command = "ffmpeg -y -framerate 1 -i '#{temp_dir.join("image_%d.jpg")}' -c:v libx264 '#{output_path}'"

    Rails.logger.info("Comando ffmpeg: #{command}")

    # Ejecutar el comando y capturar la salida
    output = `#{command} 2>&1`
    if $?.exitstatus != 0
      Rails.logger.error("Error al ejecutar ffmpeg: #{output}")
    else
      Rails.logger.info("Video generado correctamente en: #{output_path}")
    end

    # Limpiar archivos temporales
    FileUtils.rm_rf(temp_dir)
  end
end
