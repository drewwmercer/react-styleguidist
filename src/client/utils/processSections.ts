import * as Rsg from '../../typings';
import processComponents, { HrefOptions } from './processComponents';
import getUrl from './getUrl';

/**
 * Recursively process each component in all sections.
 *
 * @param {Array} sections
 * @return {Array}
 */
export default function processSections(
	sections: Rsg.Section[],
	{ useRouterLinks, useHashId = false, hashPath = [] }: HrefOptions
): Rsg.Section[] {
	return sections.map(section => {
		const options = {
			useRouterLinks,
			useHashId: section.sectionDepth === 0,
			hashPath: [...hashPath, section.name ? section.name : '-'],
		};
		const href =
			section.href ||
			getUrl({
				name: section.name,
				slug: section.slug,
				anchor: !useRouterLinks,
				hashPath: useRouterLinks ? hashPath : false,
				id: useRouterLinks ? useHashId : false,
			});
		if (section.name === 'First File') {
			console.log('section', href, hashPath);
		}
		return {
			...section,
			// flag the section as an external link to avoid rendering it later
			externalLink: !!section.href,
			href,
			visibleName: section.name,
			components: processComponents(section.components || [], options),
			sections: processSections(section.sections || [], options),
		};
	});
}
