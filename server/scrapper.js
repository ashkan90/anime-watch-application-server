const fetch = require('node-fetch');
const cheerio = require('cheerio');

const url = 'http://www.turkanime.tv';

// function searchAnime(term) {
//   const searchUrl = '/anime/';
//   return fetch(`${url}${searchUrl}${term}`)
//     .then(response => response.text())
//     .then((body) => {
//       const $ = cheerio.load(body);
//       const $element = $('.panel .panel-body .table-responsive');
//       const $title = $('#detayPaylas .panel .panel-ust .panel-title');
//       const $image = $element.find('div.imaj img');
//       const $description = $element.find('td p.ozet');
//       const $categories = [];
//       $element.find('td a.btn.btn-default.btn-xs').not('[target="_blank"]').map((i, element) => {
//         $categories.push($(element).text());
//       });
//
//       const $like = $element.find('td div.btn-group a.colorbegen');
//       const $unlike = $element.find('td div.btn-group a.colorbegenme');
//
//       const anime = {
//         title: $title.text(),
//         image: $image.attr('data-src'),
//         description: $description.text(),
//         categories: $categories,
//         like: $like.text(),
//         unlike: $unlike.text(),
//       };
//
//       return anime;
//       //
//       // return anime
//
//       // $image.attr('data-src')
//       // $title.children[0].data
//
//       // Selenium ile falan yapılacak bu.
//       // // Bölüm listesi;
//       // const $epElement = $('.panel .panel-body.padding-none').filter(function (i, el) {
//       //   console.log($(el).text())
//       // })
//       // //const $episodes = $epElement.find($('ul.list li'))
//       //
//       // console.log($epElement.html())
//     });
// }

function animeSearch(keyword) {
    const url = `${anizm}/ara?s=${keyword}`;
    return fetch(url)
    .then(response => response.text())
    .then((body) => {
        const $results = [];

        const $ = cheerio.load(body);

        const $elements = $('.col-md-3 .item');

        $elements.map((i, el) => {
            const $el = $(el);

            $results.push({
                url: $el.find('a').attr('href'),
                title: $el.find('.anime-caption').text(),
                img: $el.find('img').attr('data-src'),
            });
        });

        // TODO: sayfalama kullanılmadan, hızlıca yapıldı.
        // daha sonra sayfalama da kullanılacak

        return $results;
    });
}

const anizm = 'https://www.anizm.tv';
function animeList() {
  const url = `${anizm}/animeler`;
  return fetch(`${url}`)
    .then(response => response.text())
    .then((body) => {
      const $list = [];

      const $ = cheerio.load(body);
      $('div.row.no-gutter .item').each((i, el) => {
        const $element = $(el);
        const $url = $element.find('a').attr('href');
        const $title = $element.find('.anime_baslik'); // $($title).text()
        const $img = $element.find('img'); // $img.attr('data-src')

        $list.push({
          url: $url,
          title: $($title).text(),
          img: $img.attr('data-src'),
        });
      });

      const $paginationElement = $('div.row.no-gutter').children().last();

      const $current = $($paginationElement).find('.active').attr('href');
      const $next = $current.slice(0, -1) + (parseInt($current.substr(-1)) + 1);
      const $total = $($paginationElement).find('.btn-white').last().attr('href');

      const $pagination = {
        current: $current,
        next: $next,
        total: $total,
      };

      $list.push($pagination);

      return $list;
    });
}

function animeDetails(keyword) {
  return fetch(`${anizm}/${keyword}`)
      .then(response => response.text())
      .then((body) => {
        var $detail = {};

        const $ = cheerio.load(body);
        const $element = $('.content-area .row .col-lg-7');

        const $title = $element.find('h2');
        const $description = $element.find('p');

        const $info = $('.sidebar .anime-bilgileri');

        const $categories = $($info.children().get(1));
        const $epCount = $($info.children().get(2));
        const $date = $($info.children().get(3));

        const $episodes = [];
        $('.well .list li').map((i, el) => {
          const $element = $(el);

          const $anchor = $element.find('a');
          let $url = $anchor.attr('href');

          $url = $url[0] !== '/' ? '/' + $url : $url;

          $episodes.push({
            url: $url,
            ep: $anchor.text()
          });
        });

        const $realCategories = [];
        $categories.text().split(' ').map((el, i) => {
          if(i > 1 && el !== '|' && el !== '' && el !== '-') {
            $realCategories.push(el)
          }
        });


        const $realDate = $date.text().split(' ').filter((i, el) => {
          if ( i > 1 && el !== '') {
            return el;
          }
        }).toString();

        $detail = {
          title: $title.text(),
          description: $description.text(),
          categories: $realCategories,
          epCount: $epCount.text(),
          date: $realDate,
          episodes: $episodes
        };


        return $detail;

      })
}

function animeEpisode(url) {
  return fetch(`${anizm}/${url}`)
      .then(res => res.text())
      .then((body) => {
        const $ = cheerio.load(body);

        const $embed = $('#video-alani iframe').attr('src');

        const $alternatives = [];

        return $embed;
      })
}

//animeEpisode('/bleach-1-bolum');

// animeDetails('tsuujou-kougeki-ga-zentai-kougeki-de-2-kai-kougeki-no-okaasan-wa-suki-desu-ka')
//     .then(r => console.log(r));
// animeList().then(r => console.log(r)) --> anizm

// searchAnime('shingeki-no-kyojin')  --> turkanıme

module.exports = {
  animeSearch,
  animeList,
  animeDetails,
  animeEpisode
};

// searchAnime('shingeki-no-kyojin')
/**
 const titles = $('div.col-xs-6 > .panel')

 titles.each(function (i, element) {
        const $element = $(element)
        const $title = $element.find('.panel-ust-ic .panel-title')

        console.log($title.text())
      }) */
