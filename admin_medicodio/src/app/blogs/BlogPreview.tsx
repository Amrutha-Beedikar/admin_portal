interface BlogPreviewProps {
  title: string;
  content: string;
  author?: string;
  date?: string;
  category?: string;
  tags?: string[];
}

const BlogPreview: React.FC<BlogPreviewProps> = ({
  title,
  content,
  author,
  date,
  category,
  tags
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
      <article className="prose lg:prose-xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <div className="flex items-center text-gray-600 text-sm space-x-4">
            {author && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {author}
              </span>
            )}
            {date && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(date).toLocaleDateString()}
              </span>
            )}
            {category && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {category}
              </span>
            )}
          </div>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div 
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  );
};

export default BlogPreview; 