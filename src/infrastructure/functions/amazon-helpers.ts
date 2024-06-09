import { ElementHandle } from 'playwright';

export async function extractAsin(
  element: ElementHandle<SVGElement | HTMLElement>,
): Promise<string> {
  const asin = await element.getAttribute('data-asin');

  return asin;
}

export async function extractTitle(
  element: ElementHandle<SVGElement | HTMLElement>,
) {
  const titleElement = await element.$('h2.a-size-mini a span');
  const title = titleElement
    ? (await titleElement.textContent()).trim()
    : 'No title';

  return title;
}

export async function extractDescription(
  element: ElementHandle<SVGElement | HTMLElement>,
) {
  const descriptionElement = await element.$('h2.a-size-mini a span');
  const description = descriptionElement
    ? await descriptionElement.textContent()
    : 'No description';

  return description;
}

export async function extractPrice(
  element: ElementHandle<SVGElement | HTMLElement>,
): Promise<number> {
  const priceElement = await element.$('span.a-price > span.a-offscreen');
  const priceText = (await priceElement?.textContent())?.trim();

  if (priceText) {
    const cleanPrice = priceText.replace(/[^\d.]/g, '');

    let firstPrice: string;

    if (cleanPrice) {
      firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
    }

    return Number(firstPrice) || Number(cleanPrice);
  }

  return 0;
}

export async function extractCurrency(
  element: ElementHandle<SVGElement | HTMLElement>,
): Promise<string> {
  const currencyElement = await element.$('.a-price-symbol');
  const currencyText = (await currencyElement?.textContent())?.trim();
  return currencyText ? currencyText : '';
}

export async function extractImgUrl(
  element: ElementHandle<SVGElement | HTMLElement>,
): Promise<string> {
  const imgElement = await element.$('.s-image');
  const imgUrl = imgElement ? await imgElement.getAttribute('src') : '';

  return imgUrl;
}

export async function extractUrl(
  element: ElementHandle<SVGElement | HTMLElement>,
  urlOrigin: string,
) {
  const urlElement = await element.$('h2.a-size-mini a'); // Update the selector to match your anchor element
  const path = urlElement ? await urlElement.getAttribute('href') : '';

  return urlOrigin + path;
}
