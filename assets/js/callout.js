document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('blockquote').forEach(function(bq) {
    if (!bq) {
      console.log('blockquote not found:', bq);
      return;
    }
    var first = bq.querySelector('p, span, strong, em');
    if (!first) {
      console.log('No child p/span/strong/em in blockquote:', bq);
      return;
    }
    var html = first.innerHTML.trim();
    var firstLine = html.split('<br>')[0].trim();
    var match = firstLine.match(/^\[!(\w+)\](.*)$/);
    console.log('bq:', bq, 'html:', html, 'firstLine:', firstLine, 'match:', match);
    if (match) {
      var type = match[1].toLowerCase();
      var title = match[2].trim();
      bq.classList.add('callout', 'callout-' + type);
      if (title) {
        var titleElem = document.createElement('div');
        titleElem.className = 'callout-title';
        titleElem.textContent = title;
        bq.insertBefore(titleElem, bq.firstChild);
        // 첫 줄에서 [!info]와 제목만 제거, 나머지 본문은 그대로 유지
        var lines = html.split('<br>');
        lines[0] = lines[0].replace(/^\[!(\w+)\](.*)$/, '').trim();
        first.innerHTML = lines.join('<br>');
      } else {
        first.innerHTML = html.replace(/^\[!(\w+)\]/, '').trim();
      }
    }
  });
});
