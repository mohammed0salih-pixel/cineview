type TechnicalDetailsProps = {
  data: {
    technical: {
      brightness: number;
      contrast: number;
      highlights: number;
      shadows: number;
      saturation: number;
      noise: number;
      sharpness: number;
    };
    color: {
      temperature: string;
    };
    media: {
      name: string;
      type: string;
      mime: string;
      size: string;
      resolution: string;
    };
    status: {
      modifiedValues: number;
      favorite: string;
      bookmarked: string;
      analysis: string;
    };
  };
};

export function TechnicalDetails({ data }: TechnicalDetailsProps) {
  return (
    <section>
      <h2>Technical Details</h2>
      <p>Measured signals, extracted metadata, and quality indicators.</p>

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <div>
          <h3>Exposure & Clarity</h3>
          <ul>
            <li>Exposure: {data.technical.brightness}</li>
            <li>Contrast: {data.technical.contrast}</li>
            <li>Highlights: {data.technical.highlights}</li>
            <li>Shadows: {data.technical.shadows}</li>
          </ul>
        </div>

        <div>
          <h3>Color Metrics</h3>
          <ul>
            <li>Vibrance: {data.technical.saturation}</li>
            <li>Temperature: {data.color.temperature}</li>
            <li>Tint: 50</li>
          </ul>
        </div>

        <div>
          <h3>View</h3>
          <ul>
            <li>Resolution: {data.media.resolution}</li>
            <li>Content Type: {data.media.type}</li>
            <li>Analysis: {data.status.analysis}</li>
          </ul>
        </div>

        <div>
          <h3>Status</h3>
          <ul>
            <li>Modified Values: {data.status.modifiedValues}</li>
            <li>Favorite: {data.status.favorite}</li>
            <li>Bookmarked: {data.status.bookmarked}</li>
          </ul>
        </div>

        <div>
          <h3>Media Metadata</h3>
          <ul>
            <li>File Name: {data.media.name}</li>
            <li>Type: {data.media.type}</li>
            <li>MIME: {data.media.mime}</li>
            <li>Size: {data.media.size}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
